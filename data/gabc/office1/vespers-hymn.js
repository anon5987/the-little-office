/**
 * Office 1 (Ordinary Time) - Vespers Hymn and Versicles
 */

// Ave Maris Stella - Hymn for Vespers
export const gabcAveMarisSella = `initial-style: 1;
annotation: 1.;
centering-scheme: latin;
%%
(c4)A(d)ve(ixhi) ma(h)ris(g') stel(h)la,(g'_) (,)
De(g)i(h') Ma(g)ter(f') al(g)ma,(h.) (;)
At(f)que(e') sem(f)per(gf) Vir(e)go,(d'_) (,)
Fe(e)lix(f') cae(d)li(cd) por(d)ta.(d.) (::)


<i>2.</i> Su(d)mens(ixhi) il(h)lud(g') A(h)ve(g'_) (,)
Ga(g)bri(h')é(g)lis(f') o(g)re,(h.) (;)
Fun(f)da(e') nos(f) in(gf) pa(e)ce,(d'_) (,)
Mu(e)tans(f') He(d)vae(cd) no(d)men.(d.) (::)

<i>3.</i> Sol(d)ve(ixhi) vin(h)cla(g') re(h)is,(g'_) (,)
Pro(g)fer(h') lu(g)men(f') cæ(g)cis,(h.) (;)
Ma(f)la(e') no(f)stra(gf) pel(e)le,(d'_) (,)
Bo(e)na(f') cun(d)cta(cd) po(d)sce.(d.) (::)

<i>4.</i> Mon(d)stra(ixhi) te es(h)se(g') ma(h)trem,(g'_) (,)
Su(g)mat(h') per(g) te(f') pre(g)ces,(h.) (;)
Qui(f) pro(e') no(f)bis(gf) na(e)tus(d'_) (,)
Tu(e)lit(f') es(d)se(cd) tu(d)us.(d.) (::)

<i>5.</i> Vir(d)go(ixhi) sin(h)gu(g')lá(h)ris,(g'_) (,)
In(g)ter(h') om(g)nes(f') mi(g)tis,(h.) (;)
Nos,(f) cul(e')pis(f) so(gf)lú(e)tos,(d'_) (,)
Mi(e)tes(f') fac(d) et(cd) ca(d)stos.(d.) (::)

<i>6.</i> Vi(d)tam(ixhi) prae(h)sta(g') pu(h)ram,(g'_) (,)
I(g)ter(h') pa(g)ra(f') tu(g)tum,(h.) (;)
Ut,(f) vi(e')dén(f)tes(gf) Je(e)sum,(d'_) (,)
Sem(e)per(f') col(d)læ(cd)té(d)mur.(d.) (::)

<i>7.</i> Sit(d) laus(ixhi) De(h)o(g') Pa(h)tri,(g'_) (,)
Sum(g)mo(h') Chri(g)sto(f') de(g)cus,(h.) (;)
Spi(f)rí(e')tu(f)i(gf) San(e)cto,(d'_) (,)
Tri(e)bus(f') ho(d)nor(cd) u(d)nus.(d.) (::)
A(ded)men.(c.d.) (::)`;

// Versicle - Solemn tone (Sundays and Feasts)
export const gabcVersicleSolemn = `initial-style: 1;
%%
(c3)Dif(h)fú(h)sa(h) est(h) grá(h)ti(h)a(h) in(h) lá(h)bi(h)is(h) tu(h)is.(g hGFEfgf.)  <i>R.</i>  (::)
Prop(h)té(h)re(h)a(h) be(h)ne(h)dí(h)xit(h) te(h) De(h)us(h) in(h) ae(h)tér(h)num.(g hGFEfgf.) (::)`;

// Versicle - Simple tone (Other times)
export const gabcVersicleSimple = `initial-style: 1;
%%
(c3)Dif(h)fú(h)sa(h) est(h) grá(h)ti(h)a(h) in(h) lá(h)bi(h)is(h) tu(h)is.(f) <i>R.</i> (::)
Prop(h)té(h)re(h)a(h) be(h)ne(h)dí(h)xit(h) te(h) De(h)us(h) in(h) ae(h)tér(h)num.(f) (::)`;

// Little Chapter - Ecclesiasticus 24:14
export const gabcEcclus = `centering-scheme: latin;
%%
(c3) Ab(h) in(h)í(h)ti(h)o,(h) et(h) an(h)te(h) sǽ(h)cu(h)la(h) cre(h)á(h)ta(h) sum,(h) (,) et(h) us(h)que(h) ad(h) fu(h)tú(h)rum(h) sǽ(h)cu(h)lum(g) non(f) dé(h)si(h)nam,(h.) (;) et(h) in(h) ha(h)bi(h)ta(h)ti(h)ó(h)ne(h) sanc(h)ta(h) co(h)ram(h) ip(h)so(h) mi(h)nis(h)trá(f)vi.(e.f.) (::) <i>R</i> De(h)o(h) gra(f)ti(e)as.(e.f.) (::)`;

// Export as object for consistent API
export default {
  'ave-maris-stella': gabcAveMarisSella,
  'vr-solemn': gabcVersicleSolemn,
  'vr-simple': gabcVersicleSimple,
  'ecclus': gabcEcclus
};
