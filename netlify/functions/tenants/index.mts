import Client, { APIError } from "@/lib/api";
import { Context } from "@netlify/functions";

export const handler = async (req: Request, context: Context) => {
    const [_, token] = (req.headers as unknown as Record<string, string>)['authorization'].split(' ');
    const client = new Client(String(Netlify.env.get('SCHOLARIS_API_ENV')), { auth: token ?? undefined });
    try {
        const res = await client.tenants.Lookup();
        return {
            statusCode: 200,
            body: JSON.stringify(res.tenants)
        }
    } catch (e) {
        const err = e as APIError
        return { statusCode: err.status, body: JSON.stringify(err) };
    }
}
