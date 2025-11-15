'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { Prescription } from '@/lib/api/prescriptions';

interface RefillRequestFormProps {
  prescription: Prescription;
  onClose: () => void;
}

export function RefillRequestForm({ prescription, onClose }: RefillRequestFormProps) {
  const router = useRouter();
  const { requestRefill } = usePrescriptions();
  const [deliveryOption, setDeliveryOption] = useState<'PICKUP' | 'DELIVERY'>('PICKUP');
  const [pharmacyId, setPharmacyId] = useState('');
  const [reason, setReason] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = await requestRefill({
        prescriptionId: prescription.id,
        reason,
        deliveryOption,
        pharmacyId: deliveryOption === 'PICKUP' ? pharmacyId : undefined,
        address: deliveryOption === 'DELIVERY' ? address : undefined
      });

      if (result) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          // Refresh the prescription details page
          router.refresh();
        }, 1500);
      } else {
        setError('Failed to submit refill request. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Refill Requested</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center" data-testid="refill-success">
          <div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <p>Your refill request has been submitted successfully.</p>
          <p className="text-sm text-muted-foreground">
            We'll notify you once your doctor approves the refill request.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={onClose}>
            Close
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} data-testid="refill-form">
        <CardHeader>
          <CardTitle>Request Medication Refill</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Medications</Label>
            <div className="bg-muted p-3 rounded-md">
              <ul className="list-disc pl-5 space-y-1">
                {prescription.medications.map((med, index) => (
                  <li key={index} className="text-sm">
                    {med.name} ({med.dosage})
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Refill (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Briefly explain why you need a refill"
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Delivery Option</Label>
            <RadioGroup value={deliveryOption} onValueChange={(val: string) => setDeliveryOption(val as 'PICKUP' | 'DELIVERY')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PICKUP" id="pickup" />
                <Label htmlFor="pickup" className="cursor-pointer">Pickup at Pharmacy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="DELIVERY" id="delivery" />
                <Label htmlFor="delivery" className="cursor-pointer">Home Delivery</Label>
              </div>
            </RadioGroup>
          </div>

          {deliveryOption === 'PICKUP' ? (
            <div className="space-y-2">
              <Label htmlFor="pharmacy">Preferred Pharmacy</Label>
              <select
                id="pharmacy"
                className="w-full p-2 border rounded-md"
                value={pharmacyId}
                onChange={(e) => setPharmacyId(e.target.value)}
                required
              >
                <option value="">Select a pharmacy</option>
                <option value="pharm1">MedPlus Pharmacy - Downtown</option>
                <option value="pharm2">HealthCare Pharmacy - Westside</option>
                <option value="pharm3">Family Drugs - Northville</option>
              </select>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={address.zipCode}
                  onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                  required
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} type="button" disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Refill Request'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
