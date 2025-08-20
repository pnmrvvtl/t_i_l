import React, { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import IridescentButton from "../components/IridescentButton/IridescentButton";
import GradientButton from "../components/IridescentButton/GradientButton/GradientButton";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
};


function generateUsers(count: number): User[] {
  faker.seed(123); 
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    avatar: faker.image.avatar(),
  }));
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    
    setTimeout(() => {
      setUsers(generateUsers(20));
    }, 500); 
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">User Grid</h1>
      <div style={{ display: "grid", gap: 16, background: "#0b0c10", padding: 24, minHeight: "100dvh" }}>
        <IridescentButton onClick={() => alert("✨ Hello!")}>Iridescent</IridescentButton>
        <IridescentButton size="lg">Bigger Shine</IridescentButton>
        <IridescentButton variant="ghost">Ghost Border</IridescentButton>
        <IridescentButton disabled>Disabled</IridescentButton>
        <GradientButton onClick={() => alert("Clicked!")}>
          Animated Gradient
        </GradientButton>
      </div>
      {users.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 border rounded-2xl bg-white shadow flex flex-col items-center"
            >
              <img
                src={user.avatar}
                alt={user.firstName}
                className="w-20 h-20 rounded-full mb-3"
              />
              <h2 className="font-semibold text-lg">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">{user.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
