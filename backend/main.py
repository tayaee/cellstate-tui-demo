import asyncio
import random
from fastapi import FastAPI, WebSocket
import uvicorn

app = FastAPI()

STOCKS = ["삼성전자", "SK하이닉스", "NVDA", "AAPL", "MSFT"]

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # 실시간 더미 데이터 생성
            data = [
                {
                    "name": s,
                    "price": random.randint(50000, 150000) if "전자" in s else random.randint(150, 900),
                    "change": round(random.uniform(-5, 5), 2)
                }
                for s in STOCKS
            ]
            await websocket.send_json(data)
            await asyncio.sleep(0.5) # 0.5초마다 전송
    except Exception:
        await websocket.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    