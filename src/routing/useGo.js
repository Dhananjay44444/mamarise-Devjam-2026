import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/store";
import { pathForView } from "./paths";

export function useGo() {
  const navigate = useNavigate();
  const { state } = useAppState();
  return (view) => navigate(pathForView(view, state.userRole));
}
