import { NextResponse } from 'next/server';

import { findValidTokenAction, markTokenUsedAction } from '@/app/actions/token';
import { serializeDoc } from '@/app/lib';
import { TokenType } from '@/models/Token';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token)
      return NextResponse.json({ success: false, message: 'Token missing' });

    const tokenDoc = await findValidTokenAction(token);
    if (!tokenDoc)
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired token',
      });

    const user = await User.findById(tokenDoc.userId);
    if (!user)
      return NextResponse.json({ success: false, message: 'User not found' });

    if (tokenDoc.type === TokenType.EMAIL_CHANGE) {
      if (!tokenDoc.email)
        return NextResponse.json({
          success: false,
          message: 'No email in token',
        });

      user.email = tokenDoc.email;
      await user.save();

      await markTokenUsedAction(tokenDoc);

      return NextResponse.json({
        success: true,
        message: 'Email changed',
        user: serializeDoc(user),
      });
    }

    if (tokenDoc.type === TokenType.VERIFICATION) {
      if (user.isActive)
        return NextResponse.json({ success: false, message: 'Already active' });

      const tempPassword = (
        await import('@/lib/generateRandomPassword')
      ).generateRandomPassword();
      user.setPassword(tempPassword);
      user.isActive = true;
      await user.save();

      await markTokenUsedAction(tokenDoc);

      // send welcome email
      await (
        await import('@/app/services/sendNodeMailer')
      ).sendMail({
        to: user.email!,
        from: { email: 'no-reply@paromaster.com', name: 'ParoMaster' },
        subject: 'Your account activated',
        body: `Your password: ${tempPassword}`,
      });

      return NextResponse.json({
        success: true,
        message: 'Account activated',
        user: serializeDoc(user),
      });
    }

    return NextResponse.json({ success: false, message: 'Unknown token type' });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({
      success: false,
      message: e.message || 'Server error',
    });
  }
}
