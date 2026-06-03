from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import httpx
from datetime import datetime
import json
from database import SessionLocal, User, MenuItem, Order
from config import TELEGRAM_BOT_TOKEN, WEBHOOK_URL, MINI_APP_URL, ADMIN_TELEGRAM_ID

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the frontend build folder (after you build the React app)
app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="frontend")

async def send_telegram_message(chat_id, text, reply_markup=None):
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {"chat_id": chat_id, "text": text}
    if reply_markup:
        payload["reply_markup"] = reply_markup
    async with httpx.AsyncClient() as client:
        await client.post(url, json=payload)

@app.post("/webhook")
async def telegram_webhook(request: Request):
    update = await request.json()
    if "message" in update:
        msg = update["message"]
        chat_id = msg["chat"]["id"]
        text = msg.get("text", "")
        
        if text == "/start":
            db = SessionLocal()
            user = db.query(User).filter(User.telegram_id == chat_id).first()
            if not user:
                user = User(telegram_id=chat_id, name=msg["chat"].get("first_name", ""))
                db.add(user)
                db.commit()
            db.close()
            
            keyboard = {
                "inline_keyboard": [[
                    {"text": "🍽️ Order Now", "web_app": {"url": MINI_APP_URL}}
                ]]
            }
            await send_telegram_message(
                chat_id,
                "✨ Welcome to **GIHOC Canteen** ✨\n\nClick below to explore our menu and place your order. Fresh meals, delivered to your desk!",
                json.dumps(keyboard)
            )
        elif text.startswith("/admin") and chat_id == ADMIN_TELEGRAM_ID:
            db = SessionLocal()
            today = datetime.utcnow().replace(hour=0, minute=0, second=0)
            orders = db.query(Order).filter(Order.created_at >= today).all()
            total_rev = sum(o.total_amount + o.delivery_fee for o in orders)
            await send_telegram_message(chat_id, f"📊 **Today's Report**\nOrders: {len(orders)}\nRevenue: {total_rev} GHS")
            db.close()
    
    return {"ok": True}

@app.post("/api/order")
async def create_order(request: Request):
    data = await request.json()
    telegram_id = data.get("telegram_id")
    items = data.get("items")
    subtotal = data.get("subtotal")
    
    db = SessionLocal()
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        return JSONResponse(status_code=404, content={"error": "User not found"})
    
    order = Order(
        user_id=user.id,
        items_json=json.dumps(items),
        total_amount=subtotal,
        delivery_fee=3.0
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    db.close()
    
    # Send confirmation to user
    total = subtotal + 3.0
    await send_telegram_message(
        telegram_id,
        f"✅ **Order #{order.id} received!**\n\n"
        f"📋 Items: {len(items)} items\n"
        f"💰 Total: {total} GHS (incl. 3 GHS delivery)\n\n"
        f"💳 **Payment:** Send exactly {total} GHS to Momo **054XXXXXXX**\n"
        f"Then reply: `PAID {order.id} [reference]`\n\n"
        f"🛵 We'll deliver to your desk within 30 mins after payment confirmation."
    )
    
    # Notify vendor group (optional)
    if VENDOR_GROUP_ID:
        await send_telegram_message(
            VENDOR_GROUP_ID,
            f"🆕 **New Order #{order.id}**\nCustomer: {user.name}\nItems: {json.dumps(items, indent=2)}\nTotal: {total} GHS"
        )
    
    return JSONResponse(content={"order_id": order.id, "status": "created"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)