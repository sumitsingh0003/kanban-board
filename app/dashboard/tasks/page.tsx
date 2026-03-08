"use client";

import Board from "@/components/Board/Board";
import useAuth from "../../../hooks/useAuth";

export default function Tasks(){

 useAuth();

 return(
   <Board />
 );

}