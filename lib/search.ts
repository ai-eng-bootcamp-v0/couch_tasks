export default async function searchToKeywords(search: string) {
  console.log("CONVERTING SEARCH QUERY TO KEYWORDS");
  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content:
            "You are an expert at taking in a search query and returning a JSON of keywords that belong to appropriate fields",
        },
        {
          role: "user",
          content: search,
        },
      ],
    }),
  });
  const data = await response.json();
  console.log(data);
}
