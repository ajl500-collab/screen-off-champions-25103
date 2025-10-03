import Header from "@/components/Header";
import { Calendar, Clock, User } from "lucide-react";

const blogPosts = [
  {
    title: "The Science Behind Screen Time Addiction",
    excerpt: "Understanding why we can't put our phones down and how competitive gamification helps break the cycle.",
    date: "March 15, 2025",
    author: "ScreenVS Team",
    readTime: "5 min read"
  },
  {
    title: "Week 1 Results: Squad Alpha Dominates",
    excerpt: "Recap of the first weekly competition and the strategies top performers used to crush their screen time goals.",
    date: "March 10, 2025",
    author: "Community Manager",
    readTime: "3 min read"
  },
  {
    title: "Introducing Efficiency Scores",
    excerpt: "Not all screen time is equal. Learn how our algorithm differentiates between productive and wasteful usage.",
    date: "March 5, 2025",
    author: "Product Team",
    readTime: "4 min read"
  },
  {
    title: "Building Healthy Phone Habits with Friends",
    excerpt: "Why accountability partners and team competition work better than willpower alone.",
    date: "March 1, 2025",
    author: "ScreenVS Team",
    readTime: "6 min read"
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background pb-24 pt-24">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Screen<span className="italic">VS</span> Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            Tips, updates, and stories from the screen time revolution
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {blogPosts.map((post, index) => (
            <article key={index} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer group">
              <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
