<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BillController extends Controller
{
    public function create(Request $request)
    {
        try {
            DB::beginTransaction();

            // Validate request
            $request->validate([
                'name' => 'required|string|max:255',
                'participants' => 'required|array|min:1',
                'participants.*.name' => 'required|string|max:255',
                'participants.*.email' => 'nullable|email',
                'items' => 'required|array|min:1',
                'items.*.name' => 'required|string|max:255',
                'items.*.amount' => 'required|numeric|min:0',
                'items.*.paidBy' => 'required|string',
                'items.*.splitBetween' => 'required|array|min:1'
            ]);

            // Create bill
            $bill = Bill::create([
                'title' => $request->name,
                'owner_id' => auth()->id()
            ]);


            // Create participants
            $participantIds = [];
            foreach ($request->participants as $participant) {
                $participantId = DB::table('bill_participants')->insertGetId([
                    'bill_id' => $bill->id,
                    'name' => $participant['name'],
                    'email' => $participant['email'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                $participantIds[$participant['id']] = $participantId;
            }

            // Create items
            foreach ($request->items as $itemData) {
                $item = Item::create([
                    'bill_id' => $bill->id,
                    'name' => $itemData['name'],
                    'price' => $itemData['amount'],
                    'payer_id'  => $participantIds[$itemData['paidBy']],
                ]);

                // Create item participants (split between)
                foreach ($itemData['splitBetween'] as $participantTempId) {
                    DB::table('item_participants')->insert([
                        'item_id' => $item->id,
                        'participant_id' => $participantIds[$participantTempId],
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Bill created successfully',
                'bill_id' => $bill->id
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create bill',
                'error' => $e->getMessage()
            ], 500);
        }
    }

public function get(int $id)
{
    $bill = Bill::with(['participants', 'items.paidByParticipant', 'items.splitBetweenParticipants'])
        ->findOrFail($id);

    // Calculate each participant's share
    $participantShares = [];
    foreach ($bill->participants as $participant) {
        $participantShares[$participant->id] = [
            'paid' => 0,
            'owes' => 0,
            'net' => 0
        ];
    }

    foreach ($bill->items as $item) {
        $splitCount = $item->splitBetweenParticipants->count();
        if ($splitCount > 0) {
            $shareAmount = $item->price / $splitCount;

            // Add amount paid
            $participantShares[$item->payer_id]['paid'] += $item->price;

            // Add amount owed by each participant
            foreach ($item->splitBetweenParticipants as $participant) {
                $participantShares[$participant->id]['owes'] += $shareAmount;
            }
        }
    }

    // Calculate net amount for each participant
    foreach ($participantShares as &$share) {
        $share['net'] = $share['paid'] - $share['owes'];
    }

    return response()->json([
        'bill' => $bill,
        'shares' => $participantShares
    ]);
}

    public function list()
    {
        $bills = Bill::with('participants')
            ->where('owner_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bills);
    }

    public function delete(int $id)
    {
        try {
            DB::beginTransaction();

            $bill = Bill::findOrFail($id);

            // Check if user owns the bill
            if ($bill->owner_id !== auth()->id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Delete related records
            DB::table('item_participants')
                ->whereIn('item_id', function($query) use ($id) {
                    $query->select('id')
                        ->from('items')
                        ->where('bill_id', $id);
                })
                ->delete();

            DB::table('items')->where('bill_id', $id)->delete();
            DB::table('bill_participants')->where('bill_id', $id)->delete();
            $bill->delete();

            DB::commit();

            return response()->json(['message' => 'Bill deleted successfully']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to delete bill',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
