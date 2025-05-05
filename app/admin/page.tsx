// 'use client'
// import { useState } from 'react';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   return (
//     <div className="min-h-screen bg-gradient-to-tr from-sky-100 to-blue-200 flex items-center justify-center">
//       <div className="flex bg-gradient-to-tr from-gray-200 to-blue-300 rounded-3xl shadow-lg overflow-hidden w-full max-w-4xl">
        
//         <div className="w-1/2 p-10 flex flex-col justify-center">
//           <h1 className="text-2xl font-bold text-gray-800 mb-6">БичигAI Admin panel-д тавтай морилно уу</h1>

//           <label className="text-sm font-medium text-gray-700">Email</label>
//           <input 
//             type="email" 
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             placeholder="example@gmail.com" 
//             className="w-full p-3 rounded-full bg-black text-white mt-1 mb-4 focus:outline-none"
//           />

//           <label className="text-sm font-medium text-gray-700">Password</label>
//           <input 
//             type="password" 
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             className="w-full p-3 rounded-full bg-black text-white mt-1 mb-2 focus:outline-none"
//           />

//           <div className="text-right text-sm text-blue-800 mb-4 cursor-pointer hover:underline">
//             Нууц үг мартсан
//           </div>

//           <button className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-semibold rounded-full py-3 hover:opacity-90">
//             Нэвтрэх
//           </button>
//         </div>

//         <div className="w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 text-white flex items-center justify-center p-10 rounded-l-[80px]">
//           <p className="text-xl font-semibold leading-relaxed">
//             “Амжилт бол өдөр бүр хийдэг <br />
//             жижиг алхмуудын үр дүн.”
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
