import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a mind map generator. Given a topic or text, create a structured mind map as JSON.

IMPORTANT: Return ONLY valid JSON, no markdown, no explanation.

The JSON must follow this exact structure:
{
  "nodes": [
    { "id": "1", "label": "Main Topic", "type": "root" },
    { "id": "2", "label": "Subtopic", "type": "branch", "parent": "1" }
  ],
  "edges": [
    { "from": "1", "to": "2", "label": "relationship" }
  ]
}

Rules:
- The first node must be type "root" with the main topic
- Create 4-8 main branches from root
- Each main branch should have 2-4 sub-branches
- Keep labels concise (1-5 words)
- Edge labels describe relationships (1-3 words)
- Use sequential numeric string IDs ("1", "2", "3"...)
- Every non-root node must have a "parent" field pointing to its parent ID
- Total nodes: 15-30 for good coverage`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a comprehensive mind map for: "${text.trim().slice(0, 500)}"` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_mindmap",
              description: "Create a structured mind map with nodes and edges",
              parameters: {
                type: "object",
                properties: {
                  nodes: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        label: { type: "string" },
                        type: { type: "string", enum: ["root", "branch"] },
                        parent: { type: "string" }
                      },
                      required: ["id", "label", "type"]
                    }
                  },
                  edges: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        from: { type: "string" },
                        to: { type: "string" },
                        label: { type: "string" }
                      },
                      required: ["from", "to"]
                    }
                  }
                },
                required: ["nodes", "edges"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_mindmap" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI usage limit reached. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errText = await response.text();
      console.error('AI gateway error:', response.status, errText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    
    let mindmapData;
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      mindmapData = JSON.parse(toolCall.function.arguments);
    } else {
      // Fallback: try parsing content directly
      const content = data.choices?.[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        mindmapData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse mind map from AI response');
      }
    }

    return new Response(JSON.stringify(mindmapData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('generate-mindmap error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
