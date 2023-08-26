import {NextResponse} from "next/server";
import * as fs from "fs";

export async function GET(request: Request) {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return NextResponse.json({ data: null }, { status: 500 })
        }
        return NextResponse.json({ data: data }, { status: 200 })
    });
    return NextResponse.json({ data: {} }, { status: 200 })
}

export async function POST(request: Request) {
    const jsonData = await request.json();
    fs.writeFile('data.json', JSON.stringify(jsonData), (err) => {
        if (err) {
            console.log(err);
            return NextResponse.json({ data: null }, { status: 500 })
        }
        return NextResponse.json({ data: jsonData }, { status: 200 })
    })
    return NextResponse.json({ data: {} }, { status: 200 })
}