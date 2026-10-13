export async function POST(req: Request) {
  const { email, items } = await req.json();

  // TODO: replace with your real product lookup
  const total = items.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity,
    0
  );

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: Math.round(total * 100),
      callback_url: "https://yoursite.com/payment/success",
    }),
  });

  const data = await res.json();
  console.log("Paystack response:", data);

  if (!data.status) {
    return Response.json({ error: data.message }, { status: 400 });
  }
  return Response.json(data.data);
}