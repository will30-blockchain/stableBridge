import React, { useState, useEffect } from 'react';
import { Wallet, ChevronDown, ChevronUp, Plus, Zap, Shield, Globe, X, ArrowRight, Target } from 'lucide-react';

const StablecoinAggregatorPoC = () => {
  const [connectedWallets, setConnectedWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [expandedWallets, setExpandedWallets] = useState({});
  const [targetAddress, setTargetAddress] = useState('');
  const [targetChain, setTargetChain] = useState('');

  const chains = [
    { id: 'ethereum', name: 'Ethereum', chainId: 1, color: 'bg-blue-500', symbol: 'ET' },
    { id: 'bsc', name: 'BNB Chain', chainId: 56, color: 'bg-yellow-500', symbol: 'BS' },
    { id: 'polygon', name: 'Polygon', chainId: 137, color: 'bg-purple-500', symbol: 'MA' },
    { id: 'arbitrum', name: 'Arbitrum', chainId: 42161, color: 'bg-blue-400', symbol: 'AR' },
    { id: 'optimism', name: 'Optimism', chainId: 10, color: 'bg-red-500', symbol: 'OP' },
    { id: 'avalanche', name: 'Avalanche', chainId: 43114, color: 'bg-red-400', symbol: 'AV' },
    { id: 'linea', name: 'Linea', chainId: 59144, color: 'bg-black', symbol: 'LN' },
    { id: 'base', name: 'Base', chainId: 8453, color: 'bg-blue-700', symbol: 'BA' },
    { id: 'blast', name: 'Blast', chainId: 81457, color: 'bg-yellow-600', symbol: 'BL' },
    { id: 'zksync', name: 'zkSync', chainId: 324, color: 'bg-slate-500', symbol: 'ZK' }
  ];

  const mockWalletData = [
    {
      id: 'wallet1',
      name: 'MetaMask',
      address: '0x1234...5678',
      type: 'metamask',
      assets: [
        { chainId: 'ethereum', usdt: 1250.50 },
        { chainId: 'polygon', usdt: 650.75 },
        { chainId: 'arbitrum', usdt: 445.80 },
        { chainId: 'bsc', usdt: 0 },
        { chainId: 'optimism', usdt: 320.40 },
        { chainId: 'avalanche', usdt: 0 },
        { chainId: 'linea', usdt: 180.25 },
        { chainId: 'base', usdt: 0 },
        { chainId: 'blast', usdt: 95.60 },
        { chainId: 'zksync', usdt: 275.30 }
      ]
    },
    {
      id: 'wallet2', 
      name: 'Coinbase Wallet',
      address: '0xabcd...efgh',
      type: 'coinbase',
      assets: [
        { chainId: 'ethereum', usdt: 890.30 },
        { chainId: 'base', usdt: 580.90 },
        { chainId: 'polygon', usdt: 750.20 },
        { chainId: 'arbitrum', usdt: 0 },
        { chainId: 'optimism', usdt: 0 },
        { chainId: 'avalanche', usdt: 425.80 },
        { chainId: 'linea', usdt: 340.15 },
        { chainId: 'bsc', usdt: 210.45 },
        { chainId: 'blast', usdt: 0 },
        { chainId: 'zksync', usdt: 0 }
      ]
    }
  ];

  const addWallet = async () => {
    setIsLoading(true);
    setTimeout(() => {
      const newWallet = mockWalletData[connectedWallets.length % mockWalletData.length];
      const walletWithId = { ...newWallet, id: `wallet_${Date.now()}` };
      setConnectedWallets(prev => [...prev, walletWithId]);
      setExpandedWallets(prev => ({ ...prev, [walletWithId.id]: true }));
      setIsLoading(false);
    }, 1500);
  };

  const removeWallet = (walletId) => {
    setConnectedWallets(prev => prev.filter(w => w.id !== walletId));
    setSelectedAssets(prev => prev.filter(asset => asset.walletId !== walletId));
  };

  const toggleWalletExpansion = (walletId) => {
    setExpandedWallets(prev => ({
      ...prev,
      [walletId]: !prev[walletId]
    }));
  };

  const toggleAssetSelection = (walletId, chainId) => {
    const assetKey = `${walletId}-${chainId}-usdt`;
    setSelectedAssets(prev => {
      const exists = prev.find(asset => asset.key === assetKey);
      if (exists) {
        return prev.filter(asset => asset.key !== assetKey);
      } else {
        const wallet = connectedWallets.find(w => w.id === walletId);
        const chainAsset = wallet.assets.find(a => a.chainId === chainId);
        const amount = chainAsset.usdt;
        if (amount > 0) {
          return [...prev, { key: assetKey, walletId, chainId, tokenType: 'usdt', amount }];
        }
      }
      return prev;
    });
  };

  const aggregateAssets = async () => {
    if (selectedAssets.length === 0 || !targetAddress || !targetChain) return;
    setIsLoading(true);
    setTimeout(() => {
      const serviceFee = selectedAssets.length * 0.1;
      alert(`Successfully aggregated ${selectedAssets.length} USDT assets to ${getChainName(targetChain)}!\nTarget: ${targetAddress}\nService fee: $${serviceFee.toFixed(1)}`);
      setSelectedAssets([]);
      setTargetAddress('');
      setTargetChain('');
      setIsLoading(false);
    }, 2000);
  };

  const getTotalUSDT = () => {
    return connectedWallets.reduce((total, wallet) => {
      return total + wallet.assets.reduce((walletTotal, asset) => {
        return walletTotal + asset.usdt;
      }, 0);
    }, 0);
  };

  const getSelectedValue = () => {
    return selectedAssets.reduce((total, asset) => total + asset.amount, 0);
  };

  const getChainName = (chainId) => {
    return chains.find(c => c.id === chainId)?.name || chainId;
  };

  const getChainColor = (chainId) => {
    return chains.find(c => c.id === chainId)?.color || 'bg-slate-500';
  };

  const getChainSymbol = (chainId) => {
    return chains.find(c => c.id === chainId)?.symbol || chainId.slice(0, 2).toUpperCase();
  };

  const isAggregateReady = selectedAssets.length > 0 && targetAddress && targetChain;

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
               backgroundSize: '20px 20px'
             }}>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Zap className="text-gray-900" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-white">StableBridge</h1>
          </div>
          
          <button
            onClick={addWallet}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isLoading 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-900 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Plus size={20} />
              <span>{isLoading ? 'Connecting...' : 'Add Wallet'}</span>
            </div>
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-white mb-4">
              Aggregate your USDT 
              <span className="text-gray-400"> across wallets & chains</span>
            </h2>
            <p className="text-gray-400 text-xl mb-8">
              Multi-wallet, multi-chain USDT management with transparent pricing
            </p>
            
            {connectedWallets.length > 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
                <div className="flex justify-between items-center text-center">
                  <div className="flex-1">
                    <p className="text-gray-400 mb-2">Connected Wallets</p>
                    <p className="text-2xl font-bold text-white">{connectedWallets.length}</p>
                  </div>
                  <div className="w-px h-12 bg-gray-700 mx-6"></div>
                  <div className="flex-1">
                    <p className="text-gray-400 mb-2">Total USDT</p>
                    <p className="text-2xl font-bold text-white">${getTotalUSDT().toLocaleString()}</p>
                  </div>
                  <div className="w-px h-12 bg-gray-700 mx-6"></div>
                  <div className="flex-1">
                    <p className="text-gray-400 mb-2">Selected</p>
                    <p className="text-2xl font-bold text-white">
                      {selectedAssets.length}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Interface */}
          {connectedWallets.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
              <Wallet className="mx-auto mb-4 text-gray-500" size={64} />
              <h3 className="text-2xl font-semibold text-white mb-2">No Wallets Connected</h3>
              <p className="text-gray-400 mb-6">Add your first wallet to start managing your USDT assets</p>
              <button
                onClick={addWallet}
                disabled={isLoading}
                className="bg-white text-gray-900 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Add First Wallet
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Wallet Cards */}
              {connectedWallets.map((wallet) => (
                <div key={wallet.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                  {/* Wallet Header */}
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                          <Wallet className="text-white" size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{wallet.name}</h3>
                          <p className="text-gray-400 text-sm">{wallet.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right mr-4">
                          <p className="text-sm text-gray-400">USDT Total</p>
                          <p className="text-lg font-semibold text-white">
                            ${wallet.assets.reduce((sum, asset) => sum + asset.usdt, 0).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleWalletExpansion(wallet.id)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          {expandedWallets[wallet.id] ? 
                            <ChevronUp className="text-gray-400" size={20} /> : 
                            <ChevronDown className="text-gray-400" size={20} />
                          }
                        </button>
                        <button
                          onClick={() => removeWallet(wallet.id)}
                          className="p-2 hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <X className="text-red-400" size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* USDT Assets - Debank Style Grid */}
                  {expandedWallets[wallet.id] && (
                    <div className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {wallet.assets.map((asset) => (
                          <div 
                            key={`${wallet.id}-${asset.chainId}`}
                            onClick={() => toggleAssetSelection(wallet.id, asset.chainId)}
                            className={`p-3 rounded-lg cursor-pointer transition-all ${
                              selectedAssets.find(a => a.key === `${wallet.id}-${asset.chainId}-usdt`) 
                                ? 'bg-green-500/20 border border-green-400 shadow-lg' 
                                : asset.usdt > 0 
                                  ? 'bg-gray-700/50 hover:bg-gray-700 border border-gray-600' 
                                  : 'bg-gray-800/50 border border-gray-700 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            {/* Chain Logo */}
                            <div className="flex items-center justify-center mb-2">
                              <div className={`w-8 h-8 rounded-full ${getChainColor(asset.chainId)} flex items-center justify-center`}>
                                <span className="text-white text-xs font-bold">
                                  {getChainSymbol(asset.chainId).slice(0, 2)}
                                </span>
                              </div>
                            </div>
                            
                            {/* Chain Name */}
                            <div className={`text-center text-sm font-medium mb-1 ${asset.usdt > 0 ? 'text-white' : 'text-gray-500'}`}>
                              {getChainName(asset.chainId)}
                            </div>
                            
                            {/* USDT Amount */}
                            <div className={`text-center text-sm ${asset.usdt > 0 ? 'text-gray-300' : 'text-gray-500'}`}>
                              {asset.usdt > 0 ? `${asset.usdt.toLocaleString()}` : '$0'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Target Configuration */}
              {selectedAssets.length > 0 && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Target className="text-gray-400" size={20} />
                    <h3 className="text-lg font-semibold text-white">Aggregation Target</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {/* Target Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Target Wallet Address
                      </label>
                      <input
                        type="text"
                        value={targetAddress}
                        onChange={(e) => setTargetAddress(e.target.value)}
                        placeholder="0x..."
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-white transition-colors"
                      />
                    </div>
                    
                    {/* Target Chain */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Target Chain
                      </label>
                      <select
                        value={targetChain}
                        onChange={(e) => setTargetChain(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-white focus:border-white transition-colors"
                      >
                        <option value="">Select target chain...</option>
                        {chains.map((chain) => (
                          <option key={chain.id} value={chain.id}>
                            {chain.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Aggregation Summary */}
              {selectedAssets.length > 0 && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Aggregation Summary</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Selected USDT Assets:</span>
                      <span className="text-white font-medium">{selectedAssets.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Value:</span>
                      <span className="text-white font-semibold">${getSelectedValue().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Service Fee ($0.1 × {selectedAssets.length}):</span>
                      <span className="text-green-400 font-medium">${(selectedAssets.length * 0.1).toFixed(1)}</span>
                    </div>
                    {targetChain && (
                      <div className="flex justify-between pt-3 border-t border-gray-700">
                        <span className="text-gray-400">Aggregating to:</span>
                        <span className="text-white font-medium">{getChainName(targetChain)}</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={aggregateAssets}
                    disabled={!isAggregateReady || isLoading}
                    className={`w-full py-4 rounded-lg font-medium transition-colors ${
                      !isAggregateReady || isLoading
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Zap size={20} />
                      <span>
                        {isLoading ? 'Aggregating...' : 
                         !targetAddress ? 'Enter target address to continue' :
                         !targetChain ? 'Select target chain to continue' :
                         `Aggregate ${selectedAssets.length} USDT Assets 🚀`}
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StablecoinAggregatorPoC;