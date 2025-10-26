"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Star, 
  Trophy, 
  Crown, 
  Shield, 
  Sword,
  X,
  Gift
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AchievementNotificationProps {
  achievement: {
    _id: string;
    badge: {
      _id: string;
      name: string;
      description: string;
      icon: string;
      category: string;
      rarity: string;
      points: number;
    };
    earnedAt: string;
    points: number;
    isNew: boolean;
  };
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose,
  autoClose = true,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 to-gray-600';
      case 'rare':
        return 'from-green-400 to-green-600';
      case 'epic':
        return 'from-purple-400 to-purple-600';
      case 'legendary':
        return 'from-yellow-400 to-yellow-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-600';
      case 'rare':
        return 'text-green-600';
      case 'epic':
        return 'text-purple-600';
      case 'legendary':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning':
        return <Trophy className="h-6 w-6" />;
      case 'achievement':
        return <Award className="h-6 w-6" />;
      case 'social':
        return <Shield className="h-6 w-6" />;
      case 'special':
        return <Crown className="h-6 w-6" />;
      default:
        return <Star className="h-6 w-6" />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30 
          }}
          className="fixed top-4 right-4 z-50 max-w-sm w-full"
        >
          <Card className={`shadow-2xl border-2 ${
            achievement.badge.rarity === 'legendary' ? 'border-yellow-400' :
            achievement.badge.rarity === 'epic' ? 'border-purple-400' :
            achievement.badge.rarity === 'rare' ? 'border-green-400' :
            'border-gray-400'
          } bg-white`}>
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Thành tích mới!
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                  }}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Achievement Content */}
              <div className="flex items-start gap-4">
                {/* Badge Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${getRarityColor(achievement.badge.rarity)} rounded-full flex items-center justify-center text-white shadow-lg`}>
                  {getCategoryIcon(achievement.badge.category)}
                </div>
                
                {/* Badge Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{achievement.badge.name}</h3>
                    <Badge 
                      variant="outline" 
                      className={`${getRarityTextColor(achievement.badge.rarity)} border-current`}
                    >
                      {achievement.badge.rarity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600">{achievement.badge.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">+{achievement.points} điểm</span>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Vừa đạt được
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Chúc mừng! Bạn đã đạt được thành tích mới!</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementNotification;
