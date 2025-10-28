import { Card } from "@/components/ui/card";

const mockMemes = [
  { id: 1, title: "Screen Time Surge 😂", date: "2 days ago" },
  { id: 2, title: "Scroll King 👑", date: "1 week ago" },
];

export const MemeHistory = () => {
  if (mockMemes.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            {profileCopy.emptyMemes}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🖼️</span>
            Meme History
          </CardTitle>
          <CardDescription>Your roast collection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockProfileData.memes.slice(0, 3).map((meme) => (
