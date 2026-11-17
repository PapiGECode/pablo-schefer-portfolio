import {GET as github} from './routes/github';
import {GET as anime} from './routes/anime';
export default {async fetch(request: Request,env: {ASSETS: Fetcher}) {
 const url=new URL(request.url);
 if(url.pathname.startsWith('/api/')) {
  if(request.method!=='GET') return Response.json({error:'method_not_allowed'},{status:405,headers:{Allow:'GET'}});
  if(url.pathname==='/api/github/repos') return github();
  if(url.pathname==='/api/anime') return anime(Object.assign(request,{nextUrl:url}));
  return Response.json({error:'not_found'},{status:404});
 }
 return env.ASSETS.fetch(request);
}};
