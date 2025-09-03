'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function TestSupabase() {
  const [status, setStatus] = useState('Connecting to Supabase...')
  const [tables, setTables] = useState<string[]>([])
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test connection
        setStatus('Testing connection to Supabase...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) throw sessionError
        
        setStatus('Connected! Fetching tables...')
        
        // Get list of tables (this requires proper RLS policies)
        const { data: tablesData, error: tablesError } = await supabase
          .from('pg_tables')
          .select('tablename')
          .eq('schemaname', 'public')
        
        if (tablesError) {
          console.warn('Could not fetch tables (this might be due to RLS):', tablesError)
          setTables(['Could not fetch tables - check console for details'])
        } else if (tablesData) {
          setTables(tablesData.map(t => t.tablename))
        }
        
        // Try to fetch from internships table directly
        setStatus('Fetching from internships table...')
        const { data: internshipsData, error: internshipsError } = await supabase
          .from('internships')
          .select('*')
          .limit(5)
        
        if (internshipsError) {
          console.error('Error fetching internships:', internshipsError)
          setError(`Error: ${internshipsError.message}`)
        } else if (internshipsData) {
          setData(internshipsData)
        }
        
        setStatus('Done! Check the data below.')
        
      } catch (err) {
        console.error('Test failed:', err)
        setError(`Error: ${err instanceof Error ? err.message : String(err)}`)
        setStatus('Test failed! Check the error below.')
      }
    }
    
    testConnection()
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
      
      <div className="bg-card p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-2">Status</h2>
        <p className="mb-4">{status}</p>
        
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded">
            <h3 className="font-semibold">Error:</h3>
            <pre className="whitespace-pre-wrap">{error}</pre>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Tables in Database</h2>
          {tables.length > 0 ? (
            <ul className="bg-muted/50 p-4 rounded">
              {tables.map((table) => (
                <li key={table} className="py-1 font-mono">• {table}</li>
              ))}
            </ul>
          ) : (
            <p>No tables found or couldn't fetch table list.</p>
          )}
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Sample Data (first 5 records)</h2>
          {data.length > 0 ? (
            <pre className="bg-muted/50 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(data, null, 2)}
            </pre>
          ) : (
            <p>No data found in the internships table.</p>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
        <div className="bg-muted/50 p-4 rounded">
          <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set'}</p>
          <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}</p>
        </div>
      </div>
    </div>
  )
}
