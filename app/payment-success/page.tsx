"use client"
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { useInterrupt } from "../contexts/InterruptContext";

export default function PaymentSuccess({
    searchParams: { amount },
  }: {
    searchParams: { amount: string };
  }) {

    const { setInterrupt} = useInterrupt(); 
    const router = useRouter(); 
    function handleOnclick() {
      router.push("/check")
    } 
    function handleSubmit(){
      setInterrupt(Math.random()); 
      router.push("/user/addstreams")
    } 
    return (
      <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
          <h2 className="text-2xl">You successfully sent</h2>
          <button onClick={handleOnclick}> Add Songs </button>
          <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
            ${amount}
          </div>
        </div>
        <h1 className="text-4xl font-extrabold mb-2">Interrupt stream</h1>
        <Button onClick={handleSubmit} className="bg-purple-700 hover:bg-purple-800 text-white w-full">
          Add songs
        </Button>
        </main>
    );
  }