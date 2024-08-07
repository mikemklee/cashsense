
import { error, json } from '@sveltejs/kit';
import { v4 as uuid } from 'uuid';

import type { LiftedTransaction } from '$lib/types';

export async function POST({ request, locals: { supabase, getSession } }) {
  const session = await getSession()
  if (!session) {
    throw error(401, 'Unauthorized');
  }

  const requestData = await request.json();

  const {
    data,
    error: insertError,
    status: statusCode,
  } = await supabase
    .from('transactions')
    .insert({
      ...requestData,
      id: uuid(),
      profile_id: session.user.id,
    })
    .select(`
      *,
      account:accounts (id, name),
      category:categories (id, name, color),
      vendor:vendors (id, name),
      adjustments:transaction_adjustments (*)
    `)

  if (insertError) {
    console.error(insertError)
    throw error(statusCode, 'Unexpected error while adding new transaction')
  } else {
    return json(data)
  }
}

export async function PATCH({ request, locals: { supabase, getSession } }) {
  const session = await getSession()
  if (!session) {
    throw error(401, 'Unauthorized');
  }

  const { id, posted_at, description, amount, category_id, account_id, vendor_id } = await request.json();

  const {
    data,
    error: updateError,
    status: statusCode,
  } = await supabase
    .from('transactions')
    .update({
      posted_at,
      description,
      amount,
      category_id,
      account_id,
      vendor_id: vendor_id || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('profile_id', session.user.id)
    .select(`
      *,
      account:accounts (id, name),
      category:categories (id, name, color),
      vendor:vendors (id, name),
      adjustments:transaction_adjustments (*)
    `)

  if (updateError) {
    console.error(updateError)
    throw error(statusCode, 'Unexpected error while updating transaction')
  } else {
    return json(data)
  }

}

export async function GET({ url, locals: { supabase } }) {
  // Get query parameters from the URL
  const searchTermParam = url.searchParams.get('searchTerm');
  const startDateParam = url.searchParams.get('startDate');
  const endDateParam = url.searchParams.get('endDate');


  // Parse and validate the query parameters
  const searchTerm = searchTermParam ? searchTermParam : null;
  const startDate = startDateParam ? new Date(startDateParam) : null;
  const endDate = endDateParam ? new Date(endDateParam) : null;

  // Check if the dates are valid
  if (startDateParam && !startDate) {
    throw error(400, 'Invalid startDate');
  }

  if (endDateParam && !endDate) {
    throw error(400, 'Invalid endDate');
  }

  let query = supabase
    .from('transactions')
    .select(`
      *,
      account:accounts (id, name),
      category:categories (id, name, color),
      vendor:vendors (id, name),
      adjustments:transaction_adjustments (*)
    `)

  if (searchTerm) {
    query = query.ilike('description', `%${searchTerm}%`)
  }

  if (startDate) {
    // Check if the start_date is provided and filter transactions after or on the startDate
    query = query.gte('posted_at', startDate.toISOString())
  }

  if (endDate) {
    // to ensure end date is inclusive
    const dayAfterEndDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);

    // Check if the end_date is provided and filter transactions before or on the endDate
    query = query.lt('posted_at', dayAfterEndDate.toISOString())
  }

  query = query.order('posted_at', { ascending: false })

  const {
    data: transactions,
    error: fetchError,
    status: statusCode,
  } = await query.returns<LiftedTransaction[]>()

  if (fetchError) {
    console.error(fetchError)
    throw error(statusCode, 'Unexpected error while fetching transactions')
  }

  return json(transactions)
}

export async function DELETE({ url, locals: { supabase, getSession } }) {
  const session = await getSession()
  if (!session) {
    throw error(401, 'Unauthorized');
  }

  const transactionId = url.searchParams.get('id')

  if (!transactionId) {
    throw error(400, 'Missing transaction ID');
  }

  const {
    error: deleteError,
    status: statusCode,
  } = await supabase.from('transactions')
    .delete()
    .eq('id', transactionId)
    .eq('profile_id', session.user.id)

  if (deleteError) {
    console.error(deleteError)
    throw error(statusCode, 'Unexpected error while deleting transaction')
  } else {
    return json('Transaction deleted')
  }
}