
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface DashboardCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  elevated?: boolean;
}

export function DashboardCard({
  title,
  icon,
  children,
  className,
  footer,
  elevated = false
}: DashboardCardProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-md", 
        elevated && "shadow-md border-primary/10",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {icon && <div className="h-5 w-5 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="pb-2">{children}</div>
        {footer && (
          <>
            <Separator className="my-2" />
            <div className="text-xs text-muted-foreground">
              {footer}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
