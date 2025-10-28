import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bulkUpsertDailyUsage } from "@/lib/data/mutations";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface CsvRow {
  date: string;
  productive_mins: number;
  unproductive_mins: number;
  neutral_mins: number;
}

export const CsvImport = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<CsvRow[]>([]);
  const queryClient = useQueryClient();

  const parseCsv = (text: string): CsvRow[] => {
    const lines = text.trim().split("\n");
    const rows: CsvRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const [date, productive, unproductive, neutral] = lines[i].split(",");
      
      if (date && productive && unproductive && neutral) {
        rows.push({
          date: date.trim(),
          productive_mins: parseInt(productive.trim()) || 0,
          unproductive_mins: parseInt(unproductive.trim()) || 0,
          neutral_mins: parseInt(neutral.trim()) || 0,
        });
      }
    }

    return rows;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = parseCsv(text);
      setPreview(rows.slice(0, 5));
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (preview.length === 0) {
      toast.error("No data to import");
      return;
    }

    setLoading(true);
    try {
      await bulkUpsertDailyUsage(
        preview.map((row) => ({
          usage_date: row.date,
          productive_mins: row.productive_mins,
          unproductive_mins: row.unproductive_mins,
          neutral_mins: row.neutral_mins,
          source: "csv",
        }))
      );

      await queryClient.invalidateQueries({ queryKey: ["daily-usage"] });
      await queryClient.invalidateQueries({ queryKey: ["weekly-usage"] });
      await queryClient.invalidateQueries({ queryKey: ["streak"] });

      toast.success(`Imported ${preview.length} entries!`);
      setPreview([]);
    } catch (error) {
      toast.error("Failed to import CSV");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border border-border rounded-xl bg-card">
      <h3 className="text-lg font-semibold">CSV Import</h3>
      <p className="text-sm text-muted-foreground">
        Upload a CSV with columns: date, productive_mins, unproductive_mins, neutral_mins
      </p>

      <div className="space-y-2">
        <Label htmlFor="csv-file">Select CSV File</Label>
        <Input
          id="csv-file"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
      </div>

      {preview.length > 0 && (
        <div className="space-y-2">
          <Label>Preview (first 5 rows)</Label>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-2 py-1 text-left">Date</th>
                  <th className="px-2 py-1 text-left">Prod</th>
                  <th className="px-2 py-1 text-left">Unprod</th>
                  <th className="px-2 py-1 text-left">Neutral</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((row, idx) => (
                  <tr key={idx} className="border-t border-border">
                    <td className="px-2 py-1">{row.date}</td>
                    <td className="px-2 py-1">{row.productive_mins}</td>
                    <td className="px-2 py-1">{row.unproductive_mins}</td>
                    <td className="px-2 py-1">{row.neutral_mins}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Button
        onClick={handleImport}
        disabled={loading || preview.length === 0}
        className="w-full"
      >
        <Upload className="mr-2 h-4 w-4" />
        {loading ? "Importing..." : `Import ${preview.length} Entries`}
      </Button>
    </div>
  );
};
