import { NextRequest } from "next/server"
import { supabase } from "@/lib/supabase"
import { getAuthUser, unauthorized, notFound, badRequest, ok } from "@/lib/api-helpers"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  const { id } = await params
  const { data: req } = await supabase
    .from("requests")
    .select("*, items!inner(poster_id, status)")
    .eq("id", id)
    .single()
  if (!req) return notFound("Request not found")

  const body = await request.json()
  const { status } = body

  if (!["accepted", "rejected", "collected"].includes(status)) {
    return badRequest("Invalid status")
  }

  if (status === "accepted" || status === "rejected") {
    const itemPosterId = (req as any).items?.poster_id
    if (itemPosterId !== user.id) return unauthorized()

    if (status === "accepted") {
      const itemStatus = (req as any).items?.status
      if (itemStatus !== "available") {
        return badRequest("Item is no longer available")
      }
      await supabase
        .from("items")
        .update({ status: "reserved", updated_at: new Date().toISOString() })
        .eq("id", req.item_id)
    }

    if (status === "rejected" && req.status === "accepted") {
      await supabase
        .from("items")
        .update({ status: "available", updated_at: new Date().toISOString() })
        .eq("id", req.item_id)
    }
  }

  if (status === "collected") {
    const itemPosterId = (req as any).items?.poster_id
    if (req.requester_id !== user.id && itemPosterId !== user.id) return unauthorized()
    if (req.status !== "accepted") {
      return badRequest("Request must be accepted before it can be collected")
    }
    await supabase
      .from("items")
      .update({ status: "completed", updated_at: new Date().toISOString() })
      .eq("id", req.item_id)
  }

  const { data, error } = await supabase
    .from("requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) return badRequest(error.message)
  return ok(data)
}
