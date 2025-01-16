import {  NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { name, description, latitude, longitude, photos } = body;
  
      const location = await prisma.location.create({
        data: {
          name,
          description,
          latitude,
          longitude,
          photos: {
            create: photos?.map((url: string) => ({ url })),
          },
        },
      });
  
      return NextResponse.json(location, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }
  
  export async function GET() {
    try {
      const locations = await prisma.location.findMany({
        include: { photos: true },
      });
  
      return NextResponse.json(locations, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }

  export async function DELETE(req: Request) {
    try {
      const body = await req.json();
      const { id } = body;
  
      if (!id) {
        return NextResponse.json({ error: "Missing location ID" }, { status: 400 });
      }
  
      await prisma.location.delete({
        where: { id },
      });
  
      return NextResponse.json({ message: "Location deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error deleting location:", error);
      return NextResponse.json({ error: "Failed to delete location" }, { status: 500 });
    }
  }