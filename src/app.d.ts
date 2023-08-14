// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import { SupabaseClient, Session } from '@supabase/supabase-js'
import type { Database } from './lib/types/supabase'

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>
      getSession(): Promise<Session | null>
    }
    interface PageData {
      session: Session | null
    }
    // interface Error {}
    // interface Platform {}
  }
}
