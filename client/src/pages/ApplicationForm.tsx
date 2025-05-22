import { UserLayout } from "@/components/UserLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function ApplicationForm() {
  return (
    <UserLayout>
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">Hello World</h2>
            <p className="text-gray-500 mb-8">Application form page placeholder</p>
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500">
                This is a placeholder for the application form. The actual form will be implemented later.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </UserLayout>
  );
}
