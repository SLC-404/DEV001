<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request){
        $data = $request->validate([
            'email'=> ['required','email'],
            'password'=> ['required','string'],
        ]);

        $user = User::where('email',$data['email'])->first();
        if(!$user || !Hash::check($data['password'],$user->password)){
            throw ValidationException::withMessages([
                'email'=>'Las credenciales no son correctas.'
            ]);
        }
        $token=$user->createToken('dev001-web')->plainTextToken;

        return response()->json([
            'token'=>$token,
            'user'=>new UserResource($user)
        ]);
    }
    public function me(Request $request){
        return new UserResource($request->user());
    }
    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->noContent();
    }
}
