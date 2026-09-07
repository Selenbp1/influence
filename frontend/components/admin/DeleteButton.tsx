"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function DeleteButton({ onConfirm }: { onConfirm: () => Promise<void> | void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        삭제
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>정말 삭제할까요?</DialogTitle>
            <DialogDescription>삭제한 내용은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button
              variant="destructive"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                await onConfirm();
                setLoading(false);
                setOpen(false);
              }}
            >
              {loading ? "삭제 중..." : "삭제하기"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
