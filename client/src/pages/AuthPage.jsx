import React, { useState } from 'react'

import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-green-400'>
      <div className='w-full max-w-md'>
        <h2 className='text-3xl font-extrabold text-center text-white mb-8'>
          {isLogin ? "Sign in to MM" : 'Create a MM Account'}
        </h2>

        <div className='bg-white p-8 rounded-lg shadow-xl'>
          {isLogin ? <LoginForm /> : <SignupForm />}
          
          <div className= 'mt-8 text-center'>
            <p className='text-sm text-gray-600'>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={() => setIsLogin((prevIsLogin) => !prevIsLogin)}
              className='mt-2 text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors duration-300'
            >
              {isLogin ? "Create Account" : "Sign In to Your Account"}
            </button>
          </div>
        </div>
      </div>     
    </div>
  )
}

export default AuthPage
