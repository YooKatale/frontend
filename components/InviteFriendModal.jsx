"use client";

import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  useToast,
  Box,
  Text,
} from "@chakra-ui/react";
import { useAuth } from "@slices/authSlice";
import { useCreateReferralCodeMutation, useSendReferralEmailMutation } from "@slices/usersApiSlice";

const INVITE_CSS = `
.invite-m-banner{position:relative;overflow:hidden;background:linear-gradient(135deg,#0e1e0e 0%,#1a5c1a 50%,#2d8c2d 100%);padding:20px 24px;}
.invite-m-banner::before{content:'';position:absolute;inset:0;opacity:.06;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
.invite-m-banner::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.06) 50%,transparent 70%);background-size:300% 100%;animation:invite-shimmer 5s infinite;}
@keyframes invite-shimmer{from{background-position:300% 0}to{background-position:-300% 0}}
.invite-m-title{font-family:'DM Serif Display',serif;font-size:22px;color:#fff;margin-bottom:4px;position:relative;z-index:1;}
.invite-m-sub{font-size:13px;color:rgba(255,255,255,.8);position:relative;z-index:1;}
.invite-m-body{padding:20px 24px;font-family:'Sora',sans-serif;}
.invite-m-body p{font-size:13px;color:#445444;line-height:1.6;margin-bottom:16px;}
.invite-m-field{margin-bottom:14px;}
.invite-m-field label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#8a9e87;margin-bottom:6px;}
.invite-m-field input{padding:10px 14px;border-radius:10px;border:1.5px solid rgba(0,0,0,.1);width:100%;font-size:14px;}
.invite-m-actions{display:flex;gap:10px;margin-top:18px;}
.invite-m-btn{flex:1;padding:12px;border-radius:100px;font-size:13px;font-weight:800;cursor:pointer;font-family:'Sora',sans-serif;border:none;}
.invite-m-btn-primary{background:#1a5c1a;color:#fff;}
.invite-m-btn-primary:hover{background:#2d8c2d;}
.invite-m-btn-ghost{background:transparent;color:#445444;border:1.5px solid rgba(0,0,0,.1);}
.invite-m-link-wrap{margin-top:12px;padding:10px 12px;background:#edf0ea;border-radius:10px;font-size:12px;color:#0e180e;word-break:break-all;}
`;

export default function InviteFriendModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const { userInfo } = useAuth();
  const [createCode, { data: codeData, isLoading: codeLoading }] = useCreateReferralCodeMutation();
  const [sendEmail, { isLoading: sendLoading }] = useSendReferralEmailMutation();
  const toast = useToast();

  const referralLink = codeData?.data?.referralCode
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${codeData.data.referralCode}`
    : "";

  const handleGetLink = async () => {
    if (!userInfo?._id) {
      toast({ title: "Please sign in to invite friends.", status: "info", duration: 3000 });
      return;
    }
    try {
      await createCode({ userId: userInfo._id }).unwrap();
      toast({ title: "Referral link ready.", status: "success", duration: 3000 });
    } catch (e) {
      toast({ title: "Could not create link.", description: e?.data?.message, status: "error", duration: 4000 });
    }
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!email?.trim()) {
      toast({ title: "Enter friend's email.", status: "info", duration: 3000 });
      return;
    }
    if (!userInfo?._id) {
      toast({ title: "Please sign in to invite friends.", status: "info", duration: 3000 });
      return;
    }
    try {
      let code = codeData?.data?.referralCode;
      if (!code) {
        const res = await createCode({ userId: userInfo._id }).unwrap();
        code = res?.data?.referralCode;
      }
      const link = code ? `${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${code}` : "";
      await sendEmail({
        email: email.trim(),
        referralCode: code,
        emailType: "invitation",
        subject: "You're invited to try YooKatale",
        html: `<p>Your friend invited you to try YooKatale. Sign up with this link: ${link}</p>`,
      }).unwrap();
      toast({ title: "Invite sent.", status: "success", duration: 3000 });
      setEmail("");
    } catch (e) {
      toast({ title: "Send failed.", description: e?.data?.message, status: "error", duration: 4000 });
    }
  };

  return (
    <>
      <style>{INVITE_CSS}</style>
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="20px" overflow="hidden">
          <ModalCloseButton color="#fff" zIndex={2} />
          <div className="invite-m-banner">
            <div className="invite-m-title">Invite a friend to test</div>
            <div className="invite-m-sub">Share YooKatale with someone. Send a link or email invite.</div>
          </div>
          <ModalBody className="invite-m-body" pt={0}>
            <p>Your friend can sign up using your referral link or you can send them an invite by email.</p>
            <div className="invite-m-field">
              <label>Referral link</label>
              {referralLink ? (
                <div className="invite-m-link-wrap">{referralLink}</div>
              ) : (
                <Button
                  size="sm"
                  colorScheme="green"
                  borderRadius="100px"
                  onClick={handleGetLink}
                  isLoading={codeLoading}
                >
                  Get my link
                </Button>
              )}
            </div>
            <form onSubmit={handleSendInvite}>
              <div className="invite-m-field">
                <label>Friend&apos;s email</label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  borderRadius="10px"
                />
              </div>
              <div className="invite-m-actions">
                <button type="button" className="invite-m-btn invite-m-btn-ghost" onClick={onClose}>
                  Close
                </button>
                <button type="submit" className="invite-m-btn invite-m-btn-primary" disabled={sendLoading}>
                  {sendLoading ? "Sending…" : "Send invite"}
                </button>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
