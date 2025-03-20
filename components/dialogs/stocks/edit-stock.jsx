"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateStock } from "@/lib/stock-api";
import { listDematAccounts } from "@/lib/demat-account-api";
import { toast } from "sonner";

const EditStockDialog = ({ open, onOpenChange, stock, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    demat_account: "",
    stock_name: "",
    stock_exchange: "",
    other_stock_exchange: "",
    quantity: "",
    purchase_price: "",
    purchase_date: "",
    current_price: "",
    total_investment: "",
  });
  const [dematAccounts, setDematAccounts] = useState([]);
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0]; // Current date for validation
  const stockExchanges = ["BSE", "NSE", "Other"];

  useEffect(() => {
    if (stock) {
      const isOtherExchange = !["BSE", "NSE"].includes(stock.stock_exchange);
      setFormData({
        demat_account: stock.demat_account?.toString() || "",
        stock_name: stock.stock_name || "",
        stock_exchange: isOtherExchange ? "Other" : stock.stock_exchange || "",
        other_stock_exchange: isOtherExchange ? stock.stock_exchange : "",
        quantity: stock.quantity?.toString() || "",
        purchase_price: stock.purchase_price?.toString() || "",
        purchase_date: stock.purchase_date || "",
        current_price: stock.current_price?.toString() || "",
        total_investment: stock.total_investment?.toString() || "",
      });
    }
  }, [stock]);

  useEffect(() => {
    if (open) fetchDematAccounts();
  }, [open]);

  const fetchDematAccounts = async () => {
    try {
      const response = await listDematAccounts();
      if (response.status) {
        setDematAccounts(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch demat accounts");
    }
  };

  const calculateTotalInvestment = () => {
    const qty = parseInt(formData.quantity) || 0;
    const price = parseFloat(formData.purchase_price) || 0;
    return (qty * price).toFixed(2);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.demat_account) newErrors.demat_account = "Demat account is required";
    if (!formData.stock_name || formData.stock_name.trim().length < 1) newErrors.stock_name = "Stock name is required";
    if (!formData.stock_exchange) newErrors.stock_exchange = "Stock exchange is required";
    else if (formData.stock_exchange === "Other" && (!formData.other_stock_exchange || formData.other_stock_exchange.trim().length < 1))
      newErrors.other_stock_exchange = "Other stock exchange name is required";
    if (!formData.quantity || isNaN(formData.quantity) || parseInt(formData.quantity) <= 0) newErrors.quantity = "Quantity must be a positive integer";
    if (!formData.purchase_price || isNaN(formData.purchase_price) || parseFloat(formData.purchase_price) <= 0)
      newErrors.purchase_price = "Purchase price must be a positive number";
    if (!formData.purchase_date) newErrors.purchase_date = "Purchase date is required";
    else if (formData.purchase_date > today) newErrors.purchase_date = "Purchase date cannot be in the future";
    if (!formData.current_price || isNaN(formData.current_price) || parseFloat(formData.current_price) <= 0)
      newErrors.current_price = "Current price must be a positive number";
    if (!formData.total_investment || isNaN(formData.total_investment) || parseFloat(formData.total_investment) <= 0)
      newErrors.total_investment = "Total investment must be a positive number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (["quantity", "purchase_price", "current_price", "total_investment"].includes(id)) {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [id]: value }));
        if (id === "quantity" || id === "purchase_price") {
          setFormData((prev) => ({ ...prev, total_investment: calculateTotalInvestment() }));
        }
      }
    } else if (id === "stock_name") {
      setFormData((prev) => ({ ...prev, [id]: value.toUpperCase() }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSelectChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "stock_exchange" && value !== "Other") {
      setFormData((prev) => ({ ...prev, other_stock_exchange: "" }));
    }
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        demat_account: parseInt(formData.demat_account),
        stock_name: formData.stock_name,
        stock_exchange: formData.stock_exchange === "Other" ? formData.other_stock_exchange : formData.stock_exchange,
        quantity: parseInt(formData.quantity),
        purchase_price: parseFloat(formData.purchase_price),
        purchase_date: formData.purchase_date,
        current_price: parseFloat(formData.current_price),
        total_investment: parseFloat(formData.total_investment),
      };
      const response = await updateStock(stock.id, payload);
      if (response.status) {
        toast.success("Stock updated successfully");
        onSuccess();
        onOpenChange(false);
      } else {
        throw new Error(response.message || "Failed to update stock");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      demat_account: "",
      stock_name: "",
      stock_exchange: "",
      other_stock_exchange: "",
      quantity: "",
      purchase_price: "",
      purchase_date: "",
      current_price: "",
      total_investment: "",
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 h-[85vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Edit Stock</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <div className="grid gap-4 p-4">
              <div className="grid gap-2">
                <Label htmlFor="demat_account">Demat Account</Label>
                <Select value={formData.demat_account} onValueChange={handleSelectChange("demat_account")} required>
                  <SelectTrigger><SelectValue placeholder="Select demat account" /></SelectTrigger>
                  <SelectContent>
                    {dematAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        {account.depository_name} - {account.account_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.demat_account && <p className="text-red-500 text-sm">{errors.demat_account}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock_name">Stock Name</Label>
                <Input
                  id="stock_name"
                  value={formData.stock_name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., RELIANCE"
                />
                {errors.stock_name && <p className="text-red-500 text-sm">{errors.stock_name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock_exchange">Stock Exchange</Label>
                <Select value={formData.stock_exchange} onValueChange={handleSelectChange("stock_exchange")} required>
                  <SelectTrigger><SelectValue placeholder="Select stock exchange" /></SelectTrigger>
                  <SelectContent>
                    {stockExchanges.map((exchange) => (
                      <SelectItem key={exchange} value={exchange}>{exchange}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.stock_exchange && <p className="text-red-500 text-sm">{errors.stock_exchange}</p>}
              </div>
              {formData.stock_exchange === "Other" && (
                <div className="grid gap-2">
                  <Label htmlFor="other_stock_exchange">Other Stock Exchange</Label>
                  <Input
                    id="other_stock_exchange"
                    value={formData.other_stock_exchange}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., NASDAQ"
                  />
                  {errors.other_stock_exchange && <p className="text-red-500 text-sm">{errors.other_stock_exchange}</p>}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="text"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 10"
                />
                {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="purchase_price">Purchase Price (₹)</Label>
                <Input
                  id="purchase_price"
                  type="text"
                  step="0.01"
                  value={formData.purchase_price}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 2500.50"
                />
                {errors.purchase_price && <p className="text-red-500 text-sm">{errors.purchase_price}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="purchase_date">Purchase Date</Label>
                <Input
                  id="purchase_date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={handleInputChange}
                  max={today}
                  required
                />
                {errors.purchase_date && <p className="text-red-500 text-sm">{errors.purchase_date}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="current_price">Current Price (₹)</Label>
                <Input
                  id="current_price"
                  type="text"
                  step="0.01"
                  value={formData.current_price}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 2600.75"
                />
                {errors.current_price && <p className="text-red-500 text-sm">{errors.current_price}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="total_investment">Total Investment (₹)</Label>
                <Input
                  id="total_investment"
                  type="text"
                  step="0.01"
                  value={formData.total_investment}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 25000.00"
                />
                {errors.total_investment && <p className="text-red-500 text-sm">{errors.total_investment}</p>}
              </div>
            </div>
          </div>
          <DialogFooter className="border-t p-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Updating..." : "Update"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStockDialog;