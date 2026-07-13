import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { CustomerDeposit } from "@/lib/models";
import {
  normalizePhone,
  isValidPhone,
  ACTIVE_STATUS,
  CARD_WITHDRAW,
  BALL_WITHDRAW,
} from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const rawPhone = request.nextUrl.searchParams.get("phone") ?? "";
    const phone = normalizePhone(rawPhone);

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Số điện thoại không hợp lệ." },
        { status: 400 },
      );
    }

    await connectMongo();

    // Check if user exists
    const exists = await CustomerDeposit.findOne({ phone }).lean();
    if (!exists) {
      return NextResponse.json(
        { error: "Không tìm thấy thông tin khách hàng." },
        { status: 404 },
      );
    }

    const fullName = exists.fullName;

    // Get all deposits for this phone, sorted newest first
    const deposits = await CustomerDeposit.find({ phone })
      .sort({ createdAt: -1 })
      .lean();

    // Build a cumulative holding snapshot after each active record.
    // Deposits are queried newest-first, so reverse a copy for chronological totals.
    let totalCards = 0;
    let totalBalls = 0;
    const holdingTotalsByRecordId = new Map<
      string,
      { cards: number; balls: number }
    >();

    for (const d of [...deposits].reverse()) {
      if (d.status === ACTIVE_STATUS) {
        if (d.cardAction !== CARD_WITHDRAW) {
          totalCards += d.remainingCards ?? d.cards;
        }
        if (d.ballAction !== BALL_WITHDRAW) {
          totalBalls += d.remainingBalls ?? d.balls;
        }
      }

      holdingTotalsByRecordId.set(String(d._id), {
        cards: totalCards,
        balls: totalBalls,
      });
    }

    const records = deposits.map((d) => {
      const holdingTotals = holdingTotalsByRecordId.get(String(d._id)) ?? {
        cards: 0,
        balls: 0,
      };

      return {
        id: String(d._id),
        depositDate: d.depositDate,
        depositTime: d.depositTime,
        cardAction: d.cardAction,
        ballAction: d.ballAction,
        cards: d.cards,
        balls: d.balls,
        remainingCards: d.remainingCards ?? d.cards,
        remainingBalls: d.remainingBalls ?? d.balls,
        totalCardsAtRecord: holdingTotals.cards,
        totalBallsAtRecord: holdingTotals.balls,
        totalText: d.totalText,
        status: d.status,
        createdByName: d.createdByName,
        createdAt:
          d.createdAt instanceof Date
            ? d.createdAt.toISOString()
            : String(d.createdAt),
      };
    });

    return NextResponse.json({
      phone,
      fullName,
      totalCards,
      totalBalls,
      records,
    });
  } catch (error) {
    console.error("[customer-api]", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra, vui lòng thử lại." },
      { status: 500 },
    );
  }
}
