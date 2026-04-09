
"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Receipt, 
  Plus, 
  Download, 
  Search, 
  CreditCard, 
  TrendingUp, 
  AlertCircle,
  Banknote,
  Loader2
} from "lucide-react";
import { useTranslation } from '@/hooks/use-translation';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from 'next/navigation';

export default function BillingPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const db = useFirestore();
  const searchParams = useSearchParams();
  const currentRole = searchParams.get('role');
  const [searchTerm, setSearchTerm] = useState('');

  const isAccountant = currentRole === 'accountant' || currentRole === 'admin';
  const isPayer = currentRole === 'student' || currentRole === 'parent';

  const invoicesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'invoices'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: invoices, isLoading } = useCollection(invoicesRef);

  const handleCreateInvoice = () => {
    if (!db) return;
    const newInvoice = {
      studentId: 'Sample Student',
      amount: 5000,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Unpaid',
      description: 'Monthly Tuition Fee',
      createdAt: serverTimestamp()
    };
    addDocumentNonBlocking(collection(db, 'invoices'), newInvoice);
    toast({ title: "Invoice Created", description: "New tuition invoice has been generated." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Receipt className="h-8 w-8 text-primary" />
            {t('billing')}
          </h1>
          <p className="text-muted-foreground">{t('ethiopiaContext')}</p>
        </div>
        <div className="flex gap-2">
          {isAccountant && (
            <>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
              <Button onClick={handleCreateInvoice}>
                <Plus className="mr-2 h-4 w-4" /> {t('invoice')}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none bg-primary text-white shadow-lg">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium opacity-80">{isAccountant ? t('totalRevenue') : 'Total Due'}</p>
              <TrendingUp className="h-5 w-5 opacity-60" />
            </div>
            <div className="text-3xl font-bold">{isAccountant ? '125,400' : '5,000'} {t('currency')}</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-emerald-600 text-white shadow-lg">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium opacity-80">{isAccountant ? 'Collected This Month' : 'Last Payment'}</p>
              <Banknote className="h-5 w-5 opacity-60" />
            </div>
            <div className="text-3xl font-bold">{isAccountant ? '45,000' : '0'} {t('currency')}</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-amber-500 text-white shadow-lg">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium opacity-80">{isAccountant ? 'Pending Dues' : 'Due Date'}</p>
              <AlertCircle className="h-5 w-5 opacity-60" />
            </div>
            <div className="text-3xl font-bold">{isAccountant ? '18,200 ETB' : 'Oct 30'}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Invoices</CardTitle>
          {isAccountant && (
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t('search')} 
                className="pl-9 h-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>{t('invoice')} #</TableHead>
                  <TableHead>{t('students')}</TableHead>
                  <TableHead>{t('amount')}</TableHead>
                  <TableHead>{t('date')}</TableHead>
                  <TableHead>{t('paymentStatus')}</TableHead>
                  {isPayer && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices?.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs">INV-{inv.id.slice(0, 6).toUpperCase()}</TableCell>
                    <TableCell className="font-bold">{inv.studentId}</TableCell>
                    <TableCell>{inv.amount} {t('currency')}</TableCell>
                    <TableCell>{inv.dueDate}</TableCell>
                    <TableCell>
                      <Badge variant={inv.status === 'Paid' ? 'default' : 'destructive'} className="uppercase text-[10px]">
                        {t(inv.status.toLowerCase() as any)}
                      </Badge>
                    </TableCell>
                    {isPayer && (
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="font-bold text-primary">
                          <CreditCard className="h-4 w-4 mr-2" /> Pay Now
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
