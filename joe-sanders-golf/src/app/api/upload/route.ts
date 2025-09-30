import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function isAdmin(request: NextRequest): boolean {
  const role = request.cookies.get('role')?.value
  const auth = request.cookies.get('auth-token')?.value
  return role === 'admin' || Boolean(auth)
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!supabaseServer) {
      return NextResponse.json({ error: 'Storage not configured' }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string | null) || 'uploads'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split('.').pop() || 'bin'
    const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, '') || 'uploads'
    const path = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabaseServer.storage.from('media').upload(path, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: false
    })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: publicUrlData } = supabaseServer.storage.from('media').getPublicUrl(path)
    const url = publicUrlData.publicUrl

    return NextResponse.json({ url, path })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Upload failed' }, { status: 500 })
  }
}
