"use client";

import { UseGetCurrentUser } from "@/api/users/get-current-user";

export default function App() {
  const user = UseGetCurrentUser();
  return (
    <main>
      <div>
        <p>hello my name</p>
        {user ? <div>{user.name}</div> : <div>user not found</div>}
      </div>
    </main>
  );
}
