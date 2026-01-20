import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function UseGetCurrentUser (){
  const user = useQuery(api.user.current)
  return user
}
