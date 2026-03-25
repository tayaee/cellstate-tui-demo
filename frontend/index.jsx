import React, { useState, useEffect } from 'react';
import { render, Box, Text, Divider, useApp, useInput } from 'cellstate';
import { WebSocket } from 'ws';

function StockApp() {
    const [stocks, setStocks] = useState([]);
    const { exit } = useApp();

    useInput((key) => {
        if (key.type === 'ctrl' && key.ctrlKey === 'c') exit();
    });

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/ws');
        ws.on('message', (data) => {
            setStocks(JSON.parse(data));
        });
        return () => ws.close();
    }, []);

    return (
        <Box padding={1} borderStyle="round" borderColor="cyan" width={60}>
            <Text bold color="yellow">   LIVE STOCK DASHBOARD (CellState + FastAPI)</Text>
            <Divider char="─" color="dim" />

            <Box flexDirection="column" marginTop={1}>
                <Box flexDirection="row" marginBottom={1}>
                    <Box width={15}><Text bold underline>종목명</Text></Box>
                    <Box width={15}><Text bold underline>현재가</Text></Box>
                    <Box width={10}><Text bold underline>변동률</Text></Box>
                </Box>

                {stocks.map((s) => (
                    <Box key={s.name} flexDirection="row">
                        <Box width={15}><Text>{s.name}</Text></Box>
                        <Box width={15}><Text color="white">{s.price.toLocaleString()}</Text></Box>
                        <Box width={10}>
                            <Text color={s.change >= 0 ? 'red' : 'blue'}>
                                {s.change >= 0 ? '▲' : '▼'} {Math.abs(s.change)}%
                            </Text>
                        </Box>
                    </Box>
                ))}
            </Box>

            <Divider color="dim" marginTop={1} />
            <Text dim italic> [Ctrl+C] 종료 | WebSocket Connected: localhost:8000</Text>
        </Box>
    );
}

const app = render(<StockApp />);
await app.waitUntilExit();