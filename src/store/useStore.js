import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export const useStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentUser: null,
      users: [], 
      balance: 0,
      transactions: [],
      savingsGoals: [],
      savingsRecords: [],
      savingsConfig: { reminderDate: 5 },
      categories: [
        { id: 'savings_out', name: 'Tabungan', icon: 'PiggyBank', type: 'expense' },
        { id: 'food', name: 'Makan', icon: 'Utensils', type: 'expense' },
        { id: 'snack', name: 'Jajan', icon: 'Coffee', type: 'expense' },
        { id: 'shopping', name: 'Belanja', icon: 'ShoppingBag', type: 'expense' },
        { id: 'transport', name: 'Transport', icon: 'Car', type: 'expense' },
        { id: 'entertainment', name: 'Hiburan', icon: 'Film', type: 'expense' },
        { id: 'home', name: 'Griya', icon: 'Home', type: 'expense' },
        { id: 'health', name: 'Sehat', icon: 'HeartPulse', type: 'expense' },
        { id: 'edu', name: 'Edu', icon: 'BookOpen', type: 'expense' },
        { id: 'selfcare', name: 'Perawatan', icon: 'HeartPulse', type: 'expense' },
        { id: 'other_exp', name: 'Lainnya', icon: 'MoreHorizontal', type: 'expense' },
        { id: 'salary', name: 'Gaji', icon: 'Wallet', type: 'income' },
        { id: 'other_inc', name: 'Lainnya', icon: 'MoreHorizontal', type: 'income' },
      ],

      initializeStore: async () => {
        try {
          const [usersRes, txnsRes, goalsRes] = await Promise.all([
             supabase.from('users').select('*'),
             supabase.from('transactions').select('*'),
             supabase.from('savings_goals').select('*')
          ]);

          const dbUsers = usersRes.data || [];
          const dbTxns = txnsRes.data || [];
          const dbGoals = goalsRes.data || [];

          const hydratedUsers = dbUsers.map(u => ({
             ...u,
             transactions: dbTxns.filter(t => t.user_email === u.email).map(tx => ({
                 id: tx.id, amount: Number(tx.amount), type: tx.type, categoryId: tx.category_id, title: tx.title, subtitle: tx.subtitle, date: tx.date
             })).sort((a,b) => new Date(b.date) - new Date(a.date)),
             savingsGoals: dbGoals.filter(g => g.user_email === u.email).map(gl => ({
                 id: gl.id, title: gl.title, category: gl.category, targetAmount: Number(gl.target_amount), currentAmount: Number(gl.current_amount), monthlyIncome: Number(gl.monthly_income), autoSaveAmount: Number(gl.auto_save_amount)
             }))
          }));

          set({ users: hydratedUsers });
          
          const currentUser = get().currentUser;
          if (currentUser) {
            const freshUser = hydratedUsers.find(u => u.email === currentUser.email);
            if (freshUser) {
               set({ 
                   balance: Number(freshUser.balance), 
                   transactions: freshUser.transactions, 
                   savingsGoals: freshUser.savingsGoals 
               });
            }
          }
        } catch(e) {
          console.error("Supabase sync error:", e);
        }
      },

      registerUser: async (name, email, password) => {
        const { error } = await supabase.from('users').insert({ email, name, password, balance: 0 });
        if (error) return console.error(error);
        
        await get().initializeStore(); 
        
        const freshUser = get().users.find(u => u.email === email);
        if (freshUser) {
          set({ currentUser: freshUser, isAuthenticated: true, balance: 0, transactions: [], savingsGoals: [] });
        }
      },

      loginUser: async (email, password) => {
        await get().initializeStore(); 
        const user = get().users.find(u => u.email === email && u.password === password);
        if (user) {
          set({
            isAuthenticated: true,
            currentUser: user,
            balance: Number(user.balance),
            transactions: user.transactions || [],
            savingsGoals: user.savingsGoals || [],
          });
          return true;
        }
        return false;
      },

      logout: () => set({ isAuthenticated: false, currentUser: null, balance: 0, transactions: [], savingsGoals: [] }),

      addTransaction: async (transaction) => {
        const userEmail = get().currentUser.email;
        const newBalance = transaction.type === 'income' ? get().balance + transaction.amount : get().balance - transaction.amount;

        await supabase.from('transactions').insert({
          id: transaction.id, user_email: userEmail, amount: transaction.amount, type: transaction.type, category_id: transaction.categoryId, title: transaction.title, subtitle: transaction.subtitle || '', date: transaction.date
        });
        await supabase.from('users').update({ balance: newBalance }).eq('email', userEmail);
        
        const newTransactions = [transaction, ...get().transactions];
        const updatedUsers = get().users.map(u => u.email === userEmail ? { ...u, balance: newBalance, transactions: newTransactions } : u);

        set({ transactions: newTransactions, balance: newBalance, users: updatedUsers });
      },

      deleteTransaction: async (id) => {
        const txn = get().transactions.find((t) => t.id === id);
        if(!txn) return;
        const newBalance = txn.type === 'income' ? get().balance - txn.amount : get().balance + txn.amount;
        const userEmail = get().currentUser.email;

        await supabase.from('transactions').delete().eq('id', id);
        await supabase.from('users').update({ balance: newBalance }).eq('email', userEmail);

        const newTransactions = get().transactions.filter(t => t.id !== id);
        const updatedUsers = get().users.map(u => u.email === userEmail ? { ...u, balance: newBalance, transactions: newTransactions } : u);

        set({ transactions: newTransactions, balance: newBalance, users: updatedUsers });
      },

      addSavingsGoal: async (goal) => {
        const userEmail = get().currentUser.email;
        const newGoal = { ...goal, currentAmount: 0 };
        
        await supabase.from('savings_goals').insert({
            id: goal.id, user_email: userEmail, title: goal.title, category: goal.category, target_amount: goal.targetAmount, current_amount: 0, monthly_income: goal.monthlyIncome || 0, auto_save_amount: goal.autoSaveAmount || 0, created_at: new Date().toISOString()
        });

        const newGoals = [newGoal, ...get().savingsGoals];
        const updatedUsers = get().users.map(u => u.email === userEmail ? { ...u, savingsGoals: newGoals } : u);
        set({ savingsGoals: newGoals, users: updatedUsers });
      },

      addSavingsRecordToGoal: async (record) => {
        const userEmail = get().currentUser.email;
        const newMainBalance = get().balance - record.amount;
        const savingsTxId = Date.now().toString();
        
        const savingsTransaction = { id: savingsTxId, amount: record.amount, type: 'transfer', categoryId: 'savings_out', title: 'Transfer ke Tabungan', subtitle: `Tujuan: ${record.title}`, date: record.date };

        await supabase.from('transactions').insert({
          id: savingsTxId, user_email: userEmail, amount: record.amount, type: 'transfer', category_id: 'savings_out', title: 'Transfer ke Tabungan', subtitle: `Tujuan: ${record.title}`, date: record.date
        });
        await supabase.from('users').update({ balance: newMainBalance }).eq('email', userEmail);

        const targetGoal = get().savingsGoals.find(g => g.id === record.goalId);
        if (targetGoal) {
           await supabase.from('savings_goals').update({ current_amount: targetGoal.currentAmount + record.amount }).eq('id', record.goalId);
        }

        const newGoals = get().savingsGoals.map(g => g.id === record.goalId ? { ...g, currentAmount: g.currentAmount + record.amount } : g);
        const newTransactions = [savingsTransaction, ...get().transactions];
        const updatedUsers = get().users.map(u => u.email === userEmail ? { ...u, balance: newMainBalance, transactions: newTransactions, savingsGoals: newGoals } : u);

        set({ savingsGoals: newGoals, balance: newMainBalance, transactions: newTransactions, users: updatedUsers });
      },

      updateUserLocation: async (email, location) => {
          await supabase.from('users').update({ location }).eq('email', email);
          const updatedUsers = get().users.map(u => u.email === email ? { ...u, location } : u);
          set({ users: updatedUsers });
      }

    }),
    {
      name: 'finance-storage',
      partialize: (state) => ({ currentUser: state.currentUser, isAuthenticated: state.isAuthenticated }),
      merge: (persistedState, currentState) => ({ ...currentState, ...persistedState, categories: currentState.categories })
    }
  )
);
