import Client, { APIError } from "@/lib/api";
import { Context } from "@netlify/functions";

export const handler = async (req: Request, context: Context) => {
    const [_, token] = (req.headers as unknown as Record<string, string>)['authorization'].split(' ');
    const client = new Client(String(Netlify.env.get('SCHOLARIS_API_ENV')), { auth: token ?? undefined });
    const query = (req as unknown as { queryStringParameters: Record<string, string> }).queryStringParameters
    try {
        const res = await client.institutions.Lookup({
            Page: Number(query['page'] ?? 0),
            Size: Number(query['size'] ?? 1000),
            SubscribedOnly: Boolean(query['subscribedOnly'] ?? false)
        });
        return {
            statusCode: 200,
            body: JSON.stringify(res.institutions)
        }
    } catch (e) {
        const err = e as APIError
        return { statusCode: err.status, body: JSON.stringify(err) };
    }
}
