// src/app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, tag, secret } = body

    // Optional: Add a secret key for security in production
    // if (secret !== process.env.REVALIDATION_SECRET) {
    //   return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    // }

    // Revalidate specific path
    if (path) {
      revalidatePath(path)
      console.log(`✅ Revalidated path: ${path}`)
    }

    // Revalidate by tag
    if (tag) {
      revalidateTag(tag)
      console.log(`✅ Revalidated tag: ${tag}`)
    }

    // If no specific path or tag, revalidate all project-related pages
    if (!path && !tag) {
      revalidatePath('/', 'layout') // Revalidate everything
      revalidatePath('/projects')
      revalidatePath('/projects/[slug]', 'page')
      console.log('✅ Revalidated all project pages')
    }

    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      message: 'Revalidation successful'
    })

  } catch (error) {
    console.error('❌ Revalidation error:', error)
    return NextResponse.json(
      { message: 'Error revalidating', error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    )
  }
}

// GET endpoint for manual triggering (useful for testing)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const path = searchParams.get('path')
  const tag = searchParams.get('tag')

  try {
    if (path) {
      revalidatePath(path)
      return NextResponse.json({ message: `Revalidated path: ${path}` })
    }

    if (tag) {
      revalidateTag(tag)
      return NextResponse.json({ message: `Revalidated tag: ${tag}` })
    }

    // Default: revalidate all project pages
    revalidatePath('/', 'layout')
    revalidatePath('/projects')
    revalidatePath('/projects/[slug]', 'page')

    return NextResponse.json({ 
      message: 'Revalidated all project pages',
      revalidated: ['/', '/projects', '/projects/[slug]']
    })

  } catch (error) {
    return NextResponse.json(
      { message: 'Error revalidating', error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    )
  }
}