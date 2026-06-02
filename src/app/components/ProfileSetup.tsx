import React, { useState } from "react";
import { useNavigate } from "react-router";
import { UserCircle, MapPin, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import {
  getDistrictOptions,
  getIncomeOptionsForSelect,
  getUniversityOptions,
  REGION_OPTIONS,
} from "../data/profile";

export function ProfileSetup() {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const [age, setAge] = useState("");
  const [income, setIncome] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [university, setUniversity] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const districtOptions = getDistrictOptions(region);
  const incomeOptions = getIncomeOptionsForSelect(income);
  const universityOptions = getUniversityOptions(district);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!age || !income || !region) {
      setError("나이, 소득, 시/도는 필수 입력입니다");
      return;
    }

    setIsLoading(true);

    try {
      await updateProfile({
        age: parseInt(age, 10),
        income,
        region: region as import("../data/profile").RegionCode,
        district: district || undefined,
        university: university || undefined,
      });

      toast.success("기본 정보가 저장되었습니다!");
      navigate("/");
    } catch (error) {
      setError("기본 정보 저장에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-8 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30 sm:py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 text-center sm:mb-8">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-500/25 sm:mb-4 sm:h-16 sm:w-16">
            <UserCircle className="h-7 w-7 text-white sm:h-8 sm:w-8" />
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-indigo-400 sm:text-3xl">
            프로필 설정
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            맞춤형 서비스를 위한 정보를 입력해주세요
          </p>
        </div>

        <Card className="rounded-2xl border-0 bg-white/80 shadow-2xl backdrop-blur-sm dark:bg-gray-800/80 sm:rounded-3xl">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* 나이 */}
              <div className="space-y-2">
                <Label htmlFor="age">나이</Label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="age"
                    type="number"
                    placeholder="만 나이를 입력하세요"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="pl-10"
                    min="19"
                    max="100"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-gray-500">만 19세 이상</p>
              </div>

              {/* 소득 */}
              <div className="space-y-2">
                <Label htmlFor="income">월 소득</Label>
                <Select value={income} onValueChange={setIncome} disabled={isLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="월 소득 구간을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 지역 */}
              <div className="space-y-2">
                <Label htmlFor="region">거주 희망 시/도</Label>
                <Select
                  value={region}
                  onValueChange={(value) => {
                    setRegion(value);
                    setDistrict("");
                    setUniversity("");
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="지역을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">거주 희망 시/군/구</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Select
                    value={district}
                    onValueChange={(value) => {
                      setDistrict(value);
                      setUniversity("");
                    }}
                    disabled={isLoading || districtOptions.length === 0}
                  >
                    <SelectTrigger className="w-full pl-10">
                      <SelectValue placeholder="시/도를 먼저 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {districtOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="university">관심 대학교</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Select
                    value={university}
                    onValueChange={setUniversity}
                    disabled={isLoading || universityOptions.length === 0}
                  >
                    <SelectTrigger className="w-full pl-10">
                      <SelectValue placeholder="대학교가 있다면 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {universityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-gray-500">대학생이라면 학교 인근 추천에 활용됩니다.</p>
              </div>

              {/* Info Box */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/60 dark:bg-blue-950/30">
                <p className="text-sm text-blue-700">
                  💡 이 정보는 계약서 분석 시 더 정확한 위험도 판단과 맞춤형 조언을 제공하는 데 사용됩니다.
                </p>
              </div>

              {/* Buttons */}
              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  disabled={isLoading}
                >
                  나중에 하기
                </Button>
                <Button
                  type="submit"
                  className="gap-2"
                  disabled={isLoading}
                >
                  완료
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
