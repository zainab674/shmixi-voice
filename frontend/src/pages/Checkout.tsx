import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const product = location.state?.product ?? null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Dummy Checkout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {product ? (
                <div className="flex gap-4">
                  <img
                    src={product.img || product.url}
                    alt={product.itemName}
                    className="w-32 h-32 object-cover rounded border"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{product.itemName}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{product.description}</p>
                    <div className="mt-2 font-bold">{product.price}</div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-600 dark:text-slate-400">No product passed. This is a dummy checkout page.</p>
              )}
              <div className="flex gap-3">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">Pay Now</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Paid</AlertDialogTitle>
                      <AlertDialogDescription>
                        This is a dummy process.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction onClick={() => navigate("/")}>Close</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;


