// app/api/cities/route.ts
import { getData } from "app/lib/novaPoshta"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { city = "Київ" } = await request.json()

    const response = await getData({
      apiKey: process.env.NOVA_API,
      modelName: "AddressGeneral",
      calledMethod: "getCities",
      methodProperties: {
        Page: "1",
        FindByString: city,
        Limit: "20"
      }
    })

    if (!response.success) {
      console.error("Failed to fetch cities")
      return NextResponse.json(
        { success: false, message: "Failed to fetch cities" },
        { status: 500 }
      )
    }

    const mappedCities = response.data.data.map((item: any) => ({
      description: item.Description,
      descriptionRu: item.DescriptionRu,
      ref: item.Ref
    }))

    return NextResponse.json({ success: true, data: mappedCities })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
