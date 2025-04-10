
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Unauthorized Access</h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          You don't have permission to access this page. Please log in with the appropriate account type.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => navigate("/")}>Go to Home</Button>
          <Button variant="outline" onClick={() => navigate("/login")}>
            Log In
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Unauthorized;
