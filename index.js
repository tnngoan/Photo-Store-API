addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */

const corsHeaders = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Origin': '*'
}

const getImages = async request => {
  const {query} = await request.json()
  const url = `https://api.unsplash.com/search/photos?query=${query}`;
  const CLIENT_ID = `DUWo6LfzB4I11spu8pkWgfbIQf0_-f_gkcxTtDVUN4c`;
  const res = await fetch(url,{
    headers: {
      Authorization: `Client-ID ${CLIENT_ID}`
    }
  })
  const data = await res.json()
  const images = data.results.map(image => ({
     id: image.id,
     image: image.urls.small,
     link: image.links.html,
     description: image.description,
     author: image.user.name
  }))
  return new Response(JSON.stringify(images), {
    headers: {
      'Content-type': 'application/json',
      ...corsHeaders
    }
  })
}

async function handleRequest(request) {
  if (request.method === "OPTIONS"){
    return new Response("OK", {
      headers: corsHeaders
    })
  }
  if( request.method === "POST"){
    return getImages(request)
  }
}
