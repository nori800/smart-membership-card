// app/api/delete-users/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const emailsToDelete = [
  'hayashida@example.com',
  'yamada@example.com',
  'sato@example.com',
  'tanaka@example.com',
  'suzuki@example.com',
];

export async function POST() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const deleted = [];

  for (const email of emailsToDelete) {
    const { data: users, error: fetchError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

    if (fetchError) {
      deleted.push({ email, success: false, error: fetchError.message });
      continue;
    }

    const target = users.users.find((user) => user.email === email);

    if (!target) {
      deleted.push({ email, success: false, error: 'User not found' });
      continue;
    }

    const { error: deleteError } = await supabase.auth.admin.deleteUser(target.id);

    if (deleteError) {
      deleted.push({ email, success: false, error: deleteError.message });
    } else {
      deleted.push({ email, success: true });
    }
  }

  return NextResponse.json({ deleted });
}