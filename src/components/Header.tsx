import logo from "@/assets/screen-vs-logo.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/")}
        >
          <img 
            src={logo} 
            alt="Screen VS Logo" 
            className="w-12 h-12 object-contain"
          />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Screen<span className="italic">VS</span>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
