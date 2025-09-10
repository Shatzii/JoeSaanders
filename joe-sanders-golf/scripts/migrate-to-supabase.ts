import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateData() {
  console.log('🚀 Starting database migration...')

  try {
    // Read local data
    const dataPath = path.join(process.cwd(), 'data', 'local-data.json')
    const localData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

    // Migrate tournaments
    console.log('📝 Migrating tournaments...')
    for (const tournament of localData.tournaments) {
      const { error } = await supabase
        .from('tournaments')
        .upsert({
          id: tournament.id,
          date: tournament.date,
          name: tournament.name,
          result: tournament.result,
          recap_text: tournament.recap_text,
          video_url: tournament.video_url,
          photo_urls: tournament.photo_urls,
          created_at: tournament.created_at,
          updated_at: tournament.updated_at
        })

      if (error) {
        console.error(`❌ Error migrating tournament ${tournament.id}:`, error)
      } else {
        console.log(`✅ Migrated tournament: ${tournament.name}`)
      }
    }

    // Migrate sponsors
    console.log('🏢 Migrating sponsors...')
    for (const sponsor of localData.sponsors) {
      const { error } = await supabase
        .from('sponsors')
        .upsert({
          id: sponsor.id,
          name: sponsor.name,
          logo_url: sponsor.logo_url,
          tier: sponsor.tier,
          website_url: sponsor.website_url,
          created_at: sponsor.created_at,
          updated_at: sponsor.updated_at
        })

      if (error) {
        console.error(`❌ Error migrating sponsor ${sponsor.id}:`, error)
      } else {
        console.log(`✅ Migrated sponsor: ${sponsor.name}`)
      }
    }

    // Migrate merchandise
    console.log('🛍️ Migrating merchandise...')
    for (const item of localData.merch) {
      const { error } = await supabase
        .from('merch')
        .upsert({
          id: item.id,
          name: item.name,
          description: item.description,
          price_id: item.price_id,
          image_url: item.image_url,
          active: item.active,
          created_at: item.created_at,
          updated_at: item.updated_at
        })

      if (error) {
        console.error(`❌ Error migrating merch ${item.id}:`, error)
      } else {
        console.log(`✅ Migrated merchandise: ${item.name}`)
      }
    }

    console.log('🎉 Database migration completed successfully!')

    // Verify migration
    console.log('🔍 Verifying migration...')
    const { data: tournaments, error: tError } = await supabase
      .from('tournaments')
      .select('count')

    const { data: sponsors, error: sError } = await supabase
      .from('sponsors')
      .select('count')

    const { data: merch, error: mError } = await supabase
      .from('merch')
      .select('count')

    if (!tError && !sError && !mError) {
      console.log(`📊 Migration Summary:`)
      console.log(`   - Tournaments: ${tournaments?.length || 0}`)
      console.log(`   - Sponsors: ${sponsors?.length || 0}`)
      console.log(`   - Merchandise: ${merch?.length || 0}`)
    }

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateData()
