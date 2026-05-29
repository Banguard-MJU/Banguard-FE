import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { getCategoryLabel, type PolicyResource } from "../data/policy";
import { getPolicies } from "../lib/policy-api";
import { getSeenPolicyIds, hasSeenRecord, markPoliciesSeen } from "../lib/policy-seen";

export function NewPolicyPopup() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [newPolicies, setNewPolicies] = useState<PolicyResource[]>([]);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    getPolicies()
      .then((policies) => {
        const ids = policies.map((p) => p.id);

        // 최초 방문: 현재 정책 전체를 "이미 본 것"으로 표시하고 팝업은 띄우지 않음
        if (!hasSeenRecord()) {
          markPoliciesSeen(ids);
          return;
        }

        const seen = getSeenPolicyIds();
        const unseen = policies.filter((p) => !seen.includes(p.id));
        if (unseen.length > 0) {
          setNewPolicies(unseen);
          setOpen(true);
        }
      })
      .catch(() => {});
  }, []);

  const dismiss = () => {
    markPoliciesSeen(newPolicies.map((p) => p.id));
    setOpen(false);
  };

  const goToPolicy = () => {
    dismiss();
    navigate("/policy");
  };

  if (newPolicies.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && dismiss()}>
      <DialogContent className="max-h-[85vh] w-[calc(100vw-2rem)] max-w-md overflow-y-auto rounded-3xl">
        <DialogHeader>
          <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
            <Sparkles className="h-4 w-4" />
            새로운 정책
          </div>
          <DialogTitle className="text-xl">새로 등록된 주거 정책이 있어요</DialogTitle>
          <DialogDescription>
            계약 판단에 도움이 될 수 있는 새 정책 정보를 확인해보세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {newPolicies.map((policy) => (
            <div
              key={policy.id}
              className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/20"
            >
              <div className="mb-1 flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{policy.title}</h3>
                <Badge variant="outline" className="rounded-full">
                  {getCategoryLabel(policy.category)}
                </Badge>
              </div>
              <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{policy.summary}</p>
            </div>
          ))}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" className="rounded-full" onClick={dismiss}>
            나중에 보기
          </Button>
          <Button className="rounded-full" onClick={goToPolicy}>
            정책 보러가기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
